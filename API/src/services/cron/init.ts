const cron = require('node-cron');


export default class Cron {
    public tasks = {} as any;

    #schedules(task: any) {
        return {
            minutes5 : function(remote: boolean) {
                console.log(' 🔥🔥🔥 MINUTE CRON IN SERVICE 🔥🔥🔥`')
                return cron.schedule('*/5 * * * *', function() {
                    task()
                }, {
                    scheduled: remote
                  }
                )
            },
            minutes10 : function(remote: boolean) {
                console.log(' 🔥🔥🔥 MINUTE CRON IN SERVICE 🔥🔥🔥`')
                return cron.schedule('*/10 * * * *', function() {
                    task()
                }, {
                    scheduled: remote
                  }
                )
            },
            minutes15 : function(remote: boolean) {
                console.log(' 🔥🔥🔥 MINUTE CRON IN SERVICE 🔥🔥🔥`')
                return cron.schedule('*/2 * * * *', function() {
                    task()
                }, {
                    scheduled: remote
                  }
                )
            },
            daily6hrs : function(remote: boolean) {
                console.log(' 🔥🔥🔥 DAILY CRON IN SERVICE 🔥🔥🔥`')
                return cron.schedule('0 */23 * * *', function() {
                    task()
                }, {
                    scheduled: remote
                  })
            }
        }
    }

    add(task:any, type: "minutes5" | "minutes10"|"minutes15"|"daily6hrs", id:string, remote?:boolean) {
        if(!id) return;
        this.tasks[id] = this.#schedules(task)[type](remote||true);
        return this.tasks[id];
    }

    stop(id:string) {
        this.tasks[id].stop();
    }

    start(id: string) {
        this.tasks[id].start();
    }

    drop(id: string) {
        delete this.tasks[id];
    }

}