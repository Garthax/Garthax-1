var CreepGuard = {
    run: function(creep) {
        if (creep.ticksToLive < 100) {
            var Home = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN)}});
            
            creep.moveTo(Home[0])
            creep.memory.Duty = 0
        }
        else {
            var Hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            
            if(Hostiles.length != 0) {
                var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else {
                var PatrolFlags = creep.room.find(FIND_FLAGS);
                var FlagIndex = creep.memory.Index
                
                if (creep.memory.Index != (PatrolFlags.length)) {
                    if (creep.pos.isNearTo(PatrolFlags[FlagIndex])) {
                        FlagIndex = FlagIndex + 1
                        
                        creep.memory.Index = FlagIndex
                        creep.moveTo(PatrolFlags[FlagIndex])
                    }
                    else {
                        creep.moveTo(PatrolFlags[FlagIndex])
                    }
                }
                else {
                    creep.memory.Index = 0
                }
            }
        }
    }
};

module.exports = CreepGuard;