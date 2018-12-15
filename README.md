# BrennanApp

This is an experiment in creating a web applicaton for the brennan b2 using more modern technology.

The brennan b2 web application tooling is currently HTML, JavaScript, and JQuery. This is the application that currently ships with the b2.

This application uses the Angular (not AngularJS) framework, and the TypeScript language. The Angular framework is very complete, efficient, and leads to a very modular application design with clear separation of concerns. The TypeScript language compiles to JavaScript for execution and provides excellent type-safety allowing the application to scale by not becoming cognatively unmanageable.
It is hoped that this will result in a software architecture that is more robust, more maintainable, and that can more rapidly evolve to new features.

For the time being, the principles and scope of this project are aligned toward replicating the existing functionality and appearance of the original web application. 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.2.

## Development server

Clone this repository, `cd` into the `brenna-app` folder and run the usual `npm install`. I recommend using the excellent (and free) Visual Studio Code editor.

Note: In order for the developent server to communicate with the brennan web service, it is neccessary to first modify the `lighttpd.conf` file in `/var/www` to support CORS. This should not be necessary in a production deployment of this web application.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
You can also run `ng serve --open`, which will automatically open the browser.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
