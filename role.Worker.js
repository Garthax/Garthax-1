var CreepWorker = {
    run: function(creep) {
        if (creep.memory.Duty === 0) {
            var Miners = _.filter(Game.creeps, (creep) => creep.memory.Duty == '1');
            var Sources = creep.room.find(FIND_SOURCES);
            
            if (Miners.length < (Sources.length * 2)) {
                creep.memory.Duty = 1
            }
            else {
                var Builders = _.filter(Game.creeps, (creep) => creep.memory.Duty == '2');
                var ConstructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
                
                if ((ConstructionSites.length != 0) && (Builders.length < ConstructionSites.length)) {
                        creep.memory.Duty = 2
                }
                else {
                    var Repairers = _.filter(Game.creeps, (creep) => creep.memory.Duty == '3');
                    var DamagedStructures = creep.room.find(FIND_MY_STRUCTURES, {filter: object => object.hits < object.hitsMax});
                    
                    if ((DamagedStructures != 0) && (Repairers.length > DamagedStructures.length)) {
                        creep.memory.Duty = 3
                    }
                    else {
                        var Upgraders = _.filter(Game.creeps, (creep) => creep.memory.Duty == '4');
                        if ((creep.room.controller.level != 8) && (Upgraders.length < creep.room.controller.level)) {
                            creep.memory.Duty = 4
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
            if (creep.memory.Duty === 1) {
                var creepSrc = creep.memory.SrcSelect
                
                if (creepSrc === -1) {
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
                    if((creep.carry.energy < creep.carryCapacity) && (creep.memory.SrcSelect != -1)) {
                        var Sources = creep.room.find(FIND_SOURCES);
                        var TargetSrc = creep.memory.SrcSelect

                        if(creep.harvest(Sources[TargetSrc]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(Sources[TargetSrc]);
                        }
                    }
                    else {
                        var Targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;}});
                        
                        if(Targets.length > 0) {
                            if(creep.transfer(Targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(Targets[0]);
                            }
                        }
                        else {
                            creep.memory.Duty = 0
                        }
                    }
                }
            }
            else {
                if (creep.memory.Duty === 2) {
                    if(creep.memory.Building && creep.carry.energy == 0) {
                        creep.memory.Building = false;
                    }
                    if(!creep.memory.Building && creep.carry.energy == creep.carryCapacity) {
                        creep.memory.Building = true;
                    }
                    if(creep.memory.Building) {
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
                        var NearSource = creep.pos.findClosestByRange(FIND_SOURCES);
                        
                        if(creep.harvest(NearSource) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(NearSource);
                        }
                    }
                }
                else {
                    if (creep.memory.Duty === 3) {
                        if(creep.memory.Building && creep.carry.energy == 0) {
                            creep.memory.Building = false;
                        }
                        if(!creep.memory.Building && creep.carry.energy == creep.carryCapacity) {
                            creep.memory.Building = true;
                        }
                        if(creep.memory.Building) {
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
                            var NearSource = creep.pos.findClosestByRange(FIND_SOURCES);
                            
                            if(creep.harvest(NearSource) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(NearSource);
                            }
                        }
                    }
                    else {
                        if (creep.memory.Duty === 4) {
                            if(creep.memory.Building && creep.carry.energy == 0) {
                                creep.memory.Building = false;
                            }
                            if(!creep.memory.Building && creep.carry.energy == creep.carryCapacity) {
                                creep.memory.Building = true;
                            }
                            if(creep.memory.Building) {
                                if (creep.room.controller.level != 8) {
                                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(creep.room.controller);
                                    }
                                }
                                else {
                                    creep.memory.Duty = 0
                                }
                            }
                            else {
                                var NearSource = creep.pos.findClosestByRange(FIND_SOURCES);
                                
                                if(creep.harvest(NearSource) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(NearSource);
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