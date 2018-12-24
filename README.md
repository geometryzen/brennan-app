# BrennanApp

This is an experiment in creating a web applicaton for the [brennan](https://www.brennan.co.uk/) b2 using more modern technology.

The brennan b2 web application tooling is currently HTML, JavaScript, and JQuery. This is the application that currently ships with the b2.

This application uses the [Angular](https://angular.io/) (not AngularJS) framework developed by Google, and the [TypeScript](https://www.typescriptlang.org/) language developed by Microsoft. The Angular framework is very complete, efficient, and leads to a very modular application design with clear separation of concerns. The TypeScript language compiles to JavaScript for execution and provides excellent type-safety allowing the application to scale by not becoming cognatively unmanageable.
It is hoped that this will result in a software architecture that is more robust, more maintainable, and that can more rapidly evolve to new features.

For the time being, the principles and scope of this project are aligned toward replicating the existing functionality and appearance of the original web application. 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.2.

## Development server

### Getting the code and install dependencies

Clone this repository, `cd` into the `brennan-app` folder and run the usual `npm install`.

### CORS policy workaround

Note: In order for the developent server to communicate with the brennan web service, it is neccessary to first modify the `lighttpd.conf` file in `/var/www` to support CORS. This should not be necessary in a production deployment of this web application. The root folder of this project contains an example `lighttpd.conf` file to do this and which can be copied to the brennan `/var/www` folder. The brennan web server must be re-started.

### Updating the lighttpd.conf file

The copy can be performed with the following command from the `brennan-app` folder.

The actual IP address you should use is displayed in the brennan b2.

```
scp lighttpd.conf root@192.168.0.12:/var/www
```

When propted for a password, type `brennan`.

### Stopping and starting the brennan web server

To stop and start the brennan application:

```
ssh root@192.168.0.12
```

```
killall lighttpd
```

```
lighttpd -D -f /var/www/lighttpd.conf
```

### Launching this Web Application server locally

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
You can also run `ng serve --open`, which will automatically open the browser.

### Editing

I recommend using the excellent (and free) Visual Studio Code editor fo development work.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
