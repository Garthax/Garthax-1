var CreepWorker = require('role.Worker');
var CreepGuard = require('role.Guard');
var CreepSentry = require('role.Sentry');
var CreepTruck = require('role.Truck');

module.exports.loop = function () {
    var tower = Game.getObjectById('id709530');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax});

        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    var Workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'Worker');
    var Trucks = _.filter(Game.creeps, (creep) => creep.memory.role == 'Truck');
    var Guards = _.filter(Game.creeps, (creep) => creep.memory.role == 'Guard');
    var Sentries = _.filter(Game.creeps, (creep) => creep.memory.role == 'Sentry');
    
    console.log('Workers: ' + Workers.length + ' Trucks: ' + Trucks.length + ' Guards: ' + Guards.length + ' Sentries: ' + Sentries.length);

    if((Workers.length < 4) && (Game.spawns.HomeSpawn.energy >= 200)) {
        var newName = Game.spawns.HomeSpawn.createCreep([WORK,CARRY,MOVE], ('Worker ' + Math.floor((Math.random()*100)+1)), {role: 'Worker',Duty: 0,SrcSelect: -1});
        console.log('Spawning new Worker: ' + newName);
    }
    else {
        if((Guards.length < 4) && (Game.spawns.HomeSpawn.energy >= 200)) {
            var newName = Game.spawns.HomeSpawn.createCreep([ATTACK,MOVE], ('Guard ' + Math.floor((Math.random()*100)+1)), {role: 'Guard',Index: 0});
            console.log('Spawning new Guard: ' + newName);
        }
        else {
            if((Sentries.length < 4) && (Game.spawns.HomeSpawn.energy >= 200)) {
                var newName = Game.spawns.HomeSpawn.createCreep([RANGED_ATTACK,MOVE], ('Sentry ' + Math.floor((Math.random()*100)+1)), {role: 'Sentry',Index: 0});
                console.log('Spawning new Sentry: ' + newName);
            }
            else {
                if((Workers.length < 10) && (Game.spawns.HomeSpawn.energy >= 200)) {
                    var newName = Game.spawns.HomeSpawn.createCreep([WORK,CARRY,MOVE], ('Worker ' + Math.floor((Math.random()*100)+1)), {role: 'Worker',Duty: 0,SrcSelect: -1});
                    console.log('Spawning new Worker: ' + newName);
                }
            }
        }
    }
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
                
        if(creep.memory.role == 'Worker') {
            CreepWorker.run(creep);
        }
        if(creep.memory.role == 'Truck') {
            CreepTruck.run(creep);
        }
        if(creep.memory.role == 'Guard') {
            CreepGuard.run(creep);
        }
        if(creep.memory.role == 'Sentry') {
            CreepSentry.run(creep);
        }
    }
}