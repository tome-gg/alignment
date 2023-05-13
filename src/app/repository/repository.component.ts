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

type PlantProgress = {
  imageSource: string;
  dateTime: string;
  score: number;
  index?: number;
}

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

  plantProgress : PlantProgress[] = [
    {
      imageSource: this.getImageSrcDehydrated(1),
      dateTime: '-',
      score: 1
    },
    {
      imageSource: this.getImageSrcDehydrated(1),
      dateTime: '-',
      score: 1
    },
    {
      imageSource: this.getImageSrcDehydrated(1),
      dateTime: '-',
      score: 1
    },
    {
      imageSource: this.getImageSrcDehydrated(1),
      dateTime: '-',
      score: 1
    },
    {
      imageSource: this.getImageSrcDehydrated(1),
      dateTime: '-',
      score: 1
    },
    {
      imageSource: this.getImageSrcDehydrated(1),
      dateTime: '-',
      score: 1
    },
    {
      imageSource: this.getImageSrcDehydrated(1),
      dateTime: '-',
      score: 1
    },
  ]

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

    let setData = (aimIndex: number, index: number) => {
      const training = this.trainingData[index];

      if (!training) {
          this.plantProgress[aimIndex].dateTime = "-";
          this.plantProgress[aimIndex].imageSource = this.getImageSrcDehydrated(1);
          this.plantProgress[aimIndex].score = 0;
          this.plantProgress[aimIndex].index = index;
          return;
      }

      this.plantProgress[aimIndex].dateTime = training.datetimeReadable;
      const score = training.eval.score ?? 0;

      if (!score) {
        let adjustedScore = 1;
        switch (aimIndex) {
          case 0: adjustedScore = this.plantProgress[1].score; break;
          case 1: adjustedScore = this.plantProgress[2].score; break;
          case 2: adjustedScore = this.plantProgress[3].score; break;
          case 3: adjustedScore = this.plantProgress[4].score; break;
          case 4: adjustedScore = this.plantProgress[5].score; break;
          case 5: adjustedScore = this.plantProgress[6].score; break;
          case 6: adjustedScore = 1; break;
        }
        this.plantProgress[aimIndex].imageSource = this.getImageSrcDehydrated(adjustedScore);
      } else {
        this.plantProgress[aimIndex].imageSource = this.getImageSrc(score);
      }
    }

    let observer = new IntersectionObserver((entries, observer) => { 
        entries.forEach(entry => {
            if(entry.isIntersecting){
              
              const index = Array.from((entry as any).target.parentNode.children).indexOf(entry.target);
              
              setData(0, index-3);
              setData(1, index-2);
              setData(2, index-1);
              setData(3, index);
              setData(4, index+1);
              setData(5, index+2);
              setData(6, index+3);
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
