var CreepWorker = {
    run: function(creep) {
        if (creep.memory.Duty = 0) {
            var Miners = _.filter(Game.creeps, (creep) => creep.memory.Duty == '1');
            var Sources = creep.room.find(FIND_SOURCES);
            
            if (Miners < (Sources.length * 2)) {
                creep.memory.Duty = 1    
            }
            else {
                var Builders = _.filter(Game.creeps, (creep) => creep.memory.Duty == '2');
                var ConstructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
                
                if ((ConstructionSites.length != 0) && (Builders < ConstructionSites)) {
                        creep.memory.Duty = 2
                }
                else {
                    var Repairers = _.filter(Game.creeps, (creep) => creep.memory.Duty == '3');
                    var DamagedStructures = creep.room.find(FIND_MY_STRUCTURES, {filter: object => object.hits < object.hitsMax});
                    
                    if ((DamagedStructures != 0) && (Repairers > DamagedStructures)) {
                        creep.memory.Duty = 3
                    }
                    else {
                        var Upgraders = _.filter(Game.creeps, (creep) => creep.memory.Duty == '4');
                        if ((room.controller.level != 8) && (Upgraders < room.controller.level)) {
                            creep.memory.duty = 4
                        }
                        else {
                            var Home = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN)}});
                            creep.moveTo(Home[0])
                        }
                    }
                }
            }
        }
        else {
            if (creep.memory.Duty = 1) {
                var creepSrc = creep.memory.SrcSelect
                
                if (creepSrc == -1) {
                    var Sources = creep.room.find(FIND_SOURCES);
                    var SrcIndex = 0
                    var MnrIndex = 0
                    
                    while (SrcIndex < Sources.length) {
                        var MnrsThisSrc = _.filter(Game.creeps, (creep) => creep.memory.SrcSelect == (SrcIndex));
                        
                        if (MnrsThisSrc.length < 2) {
                            creep.memory.SrcSelect = SrcIndex
                            SrcIndex = Sources.length
                        }
                        SrcIndex = SrcIndex + 1
                    }
                }
                else {
                    if((creep.carry.energy < creep.carryCapacity)) {
                        var sources = creep.room.find(FIND_SOURCES);
                        var TargetSrc = creep.memory.SrcSelect
                        
                        if(creep.harvest(sources[TargetSrc]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[TargetSrc]);
                        }
                    }
                    else {
                        var targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;}});
                        
                        if(targets.length > 0) {
                            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(targets[0]);
                            }
                        }
                        else {
                            creep.memory.Duty = 0
                        }
                    }
                }
            }
            else {
                if (creep.memory.Duty = 2) {
                    if(creep.memory.building && creep.carry.energy == 0) {
                        creep.memory.building = false;
                    }
                    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                        creep.memory.building = true;
                    }
                    if(creep.memory.building) {
                        var ConstructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
                        if(ConstructionSites.length != 0) {
                            if(creep.build(ConstructionSites[0]) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(ConstructionSites[0]);
                            }
                        }
                        else {
                            creep.memory.Duty = 0
                        }
                    }
                    else {
                        var sources = creep.room.findClosestByRange(FIND_SOURCES);
                        
                        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[0]);
                        }
                    }
                }
                else {
                    if (creep.memory.Duty = 3) {
                        if(creep.memory.building && creep.carry.energy == 0) {
                            creep.memory.building = false;
                        }
                        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                            creep.memory.building = true;
                        }
                        if(creep.memory.building) {
                            var DamagedStructures = creep.room.find(FIND_MY_STRUCTURES, {filter: object => object.hits < object.hitsMax});
                            
                            if(DamagedStructures.length != 0) {
                                if(creep.repair(DamagedStructures[0]) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(DamagedStructures[0]);
                                }
                            }
                            else {
                                creep.memory.Duty = 0
                            }
                        }
                        else {
                            var sources = creep.room.findClosestByRange(FIND_SOURCES);
                            
                            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(sources[0]);
                            }
                        }
                    }
                    else {
                        if (creep.memory.Duty = 4) {
                            if(creep.memory.building && creep.carry.energy == 0) {
                                creep.memory.building = false;
                            }
                            if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                                creep.memory.building = true;
                            }
                            if(creep.memory.building) {
                                if (room.controller.level != 8) {
                                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(creep.room.controller);
                                    }
                                }
                                else {
                                    creep.memory.Duty = 0
                                }
                            }
                            else {
                                var sources = creep.room.findClosestByRange(FIND_SOURCES);
                                
                                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(sources[0]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = CreepWorker;