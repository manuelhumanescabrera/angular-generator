const child_proccess = require('child_process');
const fs = require('fs');
const config = require('./config.json');
const path = '.';
const pathFull = path + '/' + config.nameProject;
const changePath = 'cd ./' + pathFull;
// const app = pathFull + '/src/app/';

// const routes = config.routes;
const modules = config.modules;
const components = config.components;
const services = config.services;
const pipes = config.pipes;
const guards = config.guards;
const directives = config.directives;
const interfaces = config.interfaces;

const scriptsNode = config.scripts_node;
const dependencies = config.dependencies;
const devDependencies = config.devDependencies;
const angular = config.angular;
const tsconfig = config.tsconfig;

child_proccess.execSync('cd' + path + ' & ng new ' + config.nameProject + ' --style=scss --routing --skip-install');

// cargamos archivo angular.json
const angularJSON = require(pathFull + '/angular.json');
if(angular){
    if(config.prefix){
        angularJSON.projects[config.nameProject].prefix = config.prefix;
    }
    if(angular.assets){
        for(let asset of angular.assets){
            angularJSON.projects[config.nameProject].architect.build.options.assets.push(asset);
        }
    }
    if (angular.styles) {
        for (let style of angular.styles) {
            angularJSON.projects[config.nameProject].architect.build.options.styles.push(style);
        }
    }
    if (angular.scripts) {
        for (let script of angular.scripts) {
            angularJSON.projects[config.nameProject].architect.build.options.scripts.push(script);
        }
    }

    // creamos el string con nuestro JSON formateado
    var angularString = JSON.stringify(angularJSON, null, 4);

    fs.writeFileSync(pathFull + '/angular.json', angularString);

}

// instalamos los modulos
if (modules) {
    for (let module of modules) {
        child_proccess.execSync(`${changePath} & ng g m ./${module.name} ${module.routing ? ' --routing=' + module.routing : ''} ${module.route ? ' --route=' + module.route : ''} ${module.parentModule ? ' --module=' + module.parentModule : ''}`);
    }
}
// instalamos los componentes
if (components) {
    for (let component of components) {
        child_proccess.execSync(`${changePath} & ng g c ./${component.name} ${component.selector ? ' --selector=' + component.selector : ''} ${component.export ? ' --export=' + component.export : ''} ${component.parentModule ? ' --module=' + component.parentModule : ''}`);
    }
}
// instalamos los servicios
if (services) {
    for (let service of services) {
        child_proccess.execSync(changePath + ' & ng g s ./' + service);
    }
}
// instalamos los pipes
if (pipes) {
    for (let pipe of pipes) {
        child_proccess.execSync(`${changePath} & ng g p ./${pipe.name} ${pipe.export ? ' --export=' + pipe.export : ''} ${pipe.parentModule ? ' --module=' + pipe.parentModule : ''}`);
    }
}
// instalamos los guards
if (guards) {
    for (let guard of guards) {
        child_proccess.execSync(changePath + ' & ng g g ./' + guard);
    }
}
// instalamos las directivas
if (directives) {
    for (let directive of directives) {
        child_proccess.execSync(`${changePath} & ng g d ./${directive.name} ${directive.selector ? ' --selector=' + directive.selector : ''} ${directive.export ? ' --export=' + directive.export : ''} ${directive.parentModule ? ' --module=' + directive.parentModule : ''}`);
    }
}
// instalamos las interfaces
if (interfaces) {
    for (let interfaz of interfaces) {
        child_proccess.execSync(changePath + ' & ng g g ./' + interfaz);
    }
}

// aqui generaremos los directorios vacios
// for (let i = 0; i < routes.length; i++) {
//     fs.mkdirSync(`${app}${routes[i]}`);
// }

// aqui se clona ITCSS denrto de nuestro proyecto
//child_proccess.execSync(changePath + ' & git clone https://steps.everis.com/git/DIJITSEV/dfront/ninja-seed/itcss.git ./src/scss');

// cargamos el archivo package.json
const packageJSON = require(pathFull + '/package.json');

if (packageJSON && packageJSON.dependencies && packageJSON.devDependencies && packageJSON.scripts){
    if(dependencies){
        Object.assign(packageJSON.dependencies, dependencies[0]);
    }
    if(devDependencies) {
        Object.assign(packageJSON.devDependencies, devDependencies[0]);
    }
    if(scriptsNode){
        Object.assign(packageJSON.scripts, scriptsNode[0]);
    }
    var packageString = JSON.stringify(packageJSON, null, 4);

    fs.writeFileSync(pathFull + '/package.json', packageString);
}

// cargamos el archivo tsconfig.json
const tsconfigJSON = require(pathFull + '/tsconfig.app.json');

if (tsconfigJSON && tsconfigJSON.compilerOptions) {
    if (tsconfig.paths) {
        tsconfigJSON.compilerOptions.paths = tsconfig.paths;
    }
    
    var tsconfigString = JSON.stringify(tsconfigJSON, null, 4);

    fs.writeFileSync(pathFull + '/tsconfig.app.json', tsconfigString);
}