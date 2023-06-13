import Queue from 'bull';

const queue = new Queue('video', {
  limiter: {
    max: 100,
    duration: 10000,
  },
  redis: {
    port: +process.env.REDIS_PORT,
    host: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
  },
});

export default queue;

// export const createQueue = (queueName: string) => {
//   queue.process(async (job, done) => {
//     const data = job.data;
//     // try {
//     //   job.progress(0);
//     //   global.io.emit('progress', { progress: 0, jobId: data.id });
//     //   const uuid = uuidv1();
//     //   const fileLocation = `./files/${uuid}.mp4`;
//     //   await new Promise((resolve) => {
//     //     ytdl(data.url)
//     //       .on('progress', (length, downloaded, totallength) => {
//     //         const progress = (downloaded / totallength) * 100;
//     //         global.io.emit('progress', { progress, jobId: data.id });
//     //         if (progress >= 100) {
//     //           global.io.emit('videoDone', {
//     //             fileLocation: `${uuid}.mp4`,
//     //             jobId: data.id,
//     //           });
//     //           global.io.emit('progress', { progress: 100, jobId: data.id });
//     //         }
//     //       })
//     //       .pipe(fs.createWriteStream(fileLocation))
//     //       .on('finish', () => {
//     //         resolve();
//     //       });
//     //   });
//     //   await models.Job.update(
//     //     {
//     //       status: 'done',
//     //       fileLocation: `${uuid}.mp4`,
//     //     },
//     //     {
//     //       where: {
//     //         id: data.id,
//     //       },
//     //     },
//     //   );
//     //   done();
//     // } catch (ex) {
//     //   console.log(ex);
//     //   job.moveToFailed();
//     // }
//   });

//   return queue;
// };
