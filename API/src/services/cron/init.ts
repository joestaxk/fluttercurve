const cron = require('node-cron');


export default class Cron {
    public tasks = {} as any;

    #schedules(task: any) {
        return {
            minutes : function(remote: boolean) {
                console.log(' 🔥🔥🔥 MINUTE CRON IN SERVICE 🔥🔥🔥`')
                return cron.schedule('*/10 * * *  *', function() {
                    task()
                }, {
                    scheduled: remote
                  }
                )
            },
            daily : function(remote: boolean) {
                console.log(' 🔥🔥🔥 DAILY CRON IN SERVICE 🔥🔥🔥`')
                return cron.schedule('* * 23 * * *', function() {
                    task()
                }, {
                    scheduled: remote
                  })
            },
            monthly: function(remote: boolean) {
                console.log(' 🔥🔥🔥 MONTHLY CRON IN SERVICE 🔥🔥🔥`')
                return cron.schedule('* * * 28 * *', function() {
                    task()
                },{
                    scheduled: remote
                  })
            }
        }
    }

    add(task:any, type: "minutes"|"daily"|"monthly", id:string, remote?:boolean) {
        if(!id) return;
        this.tasks[id] = this.#schedules(task)[type](remote||true);
        return this.tasks[id];
    }

    stop(id:string) {
        this.tasks[id].start();
    }

    start(id: string) {
        this.tasks[id].start();
    }

    drop(id: string) {
        delete this.tasks[id];
    }

}