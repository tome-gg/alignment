import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import yaml from 'js-yaml';
import {marked} from 'marked';
marked.use({
  pedantic: false,
  gfm: true,
  mangle: false,
  headerIds: false
});

import { combineLatest, defer, from } from 'rxjs';
@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.sass']
})
export class RepositoryComponent {
  repository: string|null = null;
  trainingDataFile : string|null = null;
  evalDataFile : string|null = null;

  goals : any;
  format : any;
  trainingData : any;
  
  evaluator : any;
  evalDimensions : any;
  evalData : any;
  studentName : string = "";
  sourceURL : string = "";

  currentScore = 1;
  prevScore = 1;
  imageSourcePrev: string = this.getImageSrcDehydrated(1);
  imageSource: string = this.getImageSrcDehydrated(1);
  imageSourceNext: string = this.getImageSrcDehydrated(1);
  
  prevDateTime : string = "-";
  currentDateTime : string = "";
  nextDateTime : string = "-";

  constructor(private route: ActivatedRoute) { 
    // Sample link
    // http://localhost:4200/repo?source=github.com%2Fdarrensapalo%2Ffounder&training=dsu-reports.yaml&eval=eval-self.yaml
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.repository = params.get('source');
      this.trainingDataFile = params.get('training');
      this.evalDataFile = params.get('eval');

      this.sourceURL = `https://${this.repository}`;
      
      const trainingData$ = defer(() => from(this.fetchYaml(this.getUrl("training"))));
      const evaluationData$ = defer(() => from(this.fetchYaml(this.getUrl("evals"))));
      const repoData$ = defer(() => from(this.fetchYaml(this.getUrl("repo"))));

      combineLatest([trainingData$, evaluationData$, repoData$])
      .subscribe(([training, evals, repo]) => {
        console.log(training);
        console.log(evals);
        console.log(repo);

        this.studentName = repo.student.name;

        this.goals = training.meta.goal;
        this.format = training.meta.format;
        this.trainingData = training.content;

        this.evaluator = evals.meta.evaluator;
        this.evalDimensions = evals.meta.dimensions;
        this.evalData = evals.evaluations;

        // Preprocessing

        this.trainingData = this.trainingData.map((t: any) => ({
          ...t,
          datetimeReadable: t.datetime?.toISOString().substring(0, 10),
          doing_today: t.doing_today ? marked(t.doing_today) : null,
          done_yesterday: t.done_yesterday ? marked(t.done_yesterday) : null,
          blockers: t.blockers ? marked(t.blockers) : null,
          eval: {
            score: this.getScore(t.id),
          }
        })).sort((a: any, b: any) => {
          if (a.datetime > b.datetime) return -1;
          if (a.datetime < b.datetime) return 1;
          return 0;
        });
        
        setTimeout(() => this.postprocess(), 0);
      });

    });
  }

  postprocess() {
    // Select the anchor tag. This assumes it's the first (or only) anchor tag on the page.
    // If there are multiple anchor tags, you should use a more specific selector.
    let links = document.querySelectorAll('.repo-content li a');

    // Change the text of the link
    links.forEach(l => l.textContent = 'LINK');

    const divs = document.querySelectorAll('.data-entry');
    let options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5  // Adjust this value based on how much of the div should be visible before it is considered "visible"
    }

    let observer = new IntersectionObserver((entries, observer) => { 
        entries.forEach(entry => {
            if(entry.isIntersecting){
              
              const index = Array.from((entry as any).target.parentNode.children).indexOf(entry.target);
              const trainingNow = this.trainingData[index];
              const trainingNext = this.trainingData[index+1] || null;
              const trainingPrev = this.trainingData[index-1] || null;

              if (trainingNow) {
                const score = trainingNow.eval.score ?? 0;
                this.currentScore = score;
                
                this.currentDateTime = trainingNow.datetimeReadable;
                if (score == 0) {
                  this.imageSource = this.getImageSrcDehydrated(this.prevScore);
                } else {
                  this.imageSource = this.getImageSrc(score);
                }
              }

              if (trainingNext) {
                this.nextDateTime = trainingNext.datetimeReadable;
                const score = trainingNext.eval.score ?? 0;
                this.imageSourceNext = this.getImageSrc(score);
              } else {
                this.nextDateTime = "-";
                this.imageSourceNext = this.getImageSrc(this.prevScore);
              }

              if (trainingPrev) {
                this.prevDateTime = trainingPrev.datetimeReadable;
                const score = trainingPrev.eval.score ?? 0;
                this.prevScore = score;
                this.imageSourcePrev = this.getImageSrc(score);
              } else {
                this.prevDateTime = "-";
                this.imageSourceNext = this.getImageSrc(this.currentScore);
              }

              
            }
        });
    }, options);

    divs.forEach(div => {
        observer.observe(div);
    });

  }


  getImageSrc(level: number): string {
    let imageSrc: string;
    switch (level) {
      case 1:
        imageSrc = '/assets/growth/OrchidComm_500__1.png';
        break;
      case 2:
        imageSrc = '/assets/growth/OrchidComm_500__2.png';
        break;
      case 3:
        imageSrc = '/assets/growth/OrchidComm_500__3.png';
        break;
      case 4:
        imageSrc = '/assets/growth/OrchidComm_500__4.png';
        break;
      case 5:
        imageSrc = '/assets/growth/OrchidComm_500__5.png';
        break;
      default:
        imageSrc = this.getImageSrcDehydrated(this.prevScore);  // default image
        break;
    }
    return imageSrc;
  }

  getImageSrcDehydrated(level: number): string {
    let imageSrc: string;
    switch (level) {
      case 1:
        imageSrc = '/assets/growth/OrchidCommDehydrated_500__1.png';
        break;
      case 2:
        imageSrc = '/assets/growth/OrchidCommDehydrated_500__2.png';
        break;
      case 3:
        imageSrc = '/assets/growth/OrchidCommDehydrated_500__3.png';
        break;
      case 4:
        imageSrc = '/assets/growth/OrchidCommDehydrated_500__4.png';
        break;
      case 5:
        imageSrc = '/assets/growth/OrchidCommDehydrated_500__5.png';
        break;
      default:
        imageSrc = '/assets/growth/OrchidCommDehydrated_500__1.png';  // default image
        break;
    }
    return imageSrc;
  }

  getScore(id: string): number {
    const evaluation = this.evalData.find((d: any) => d.id === id);
    if (!evaluation) return 0;
    const score = evaluation.measurements[0]?.score;
    return score;
  }

  getUrl(type: "training"|"evals"|"repo") {
    const source = this.repository?.replace("github.com", "https://raw.githubusercontent.com");
    switch (type) {
      case 'evals':
        return `${source}/main/evaluations/${this.evalDataFile}`;
      case 'training':
        return `${source}/main/training/${this.trainingDataFile}`;
      case 'repo':
        return `${source}/main/tome.yaml`;
    }
  }


 async fetchYaml(url: string): Promise<any> {
  try {
    const response = await fetch(url);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const yamlText = await response.text();
    const data = yaml.load(yamlText);
    return data;
  } catch (error) {
    console.error('Failed to fetch YAML:', error);
  }
}
}
