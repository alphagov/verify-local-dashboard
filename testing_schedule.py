from flask import Flask
from flask_apscheduler import APScheduler


class Config(object):
    JOBS = [
        {
            "id": "job1",
            "func": "testing_schedule:job1",
            "args": (),
            "trigger": "interval",
            "seconds": 10
        }
    ]

    SCHEDULER_API_ENABLED = True


def job1():
    print(str('a'))

if __name__ == '__main__':
    app = Flask(__name__)
    app.config.from_object(Config())

    scheduler = APScheduler()
    # it is also possible to enable the API directly
    # scheduler.api_enabled = True
    scheduler.init_app(app)
    scheduler.start()

    app.run()