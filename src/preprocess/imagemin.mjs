import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

await imagemin(['./src/assets/*.{jpg,png}'], {
	destination: './src/assets',
	plugins: [
		imageminWebp({quality: 50})
	]
});

console.log('Images optimized');