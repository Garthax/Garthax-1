var CreepSentry = {
    run: function(creep) {
        var Hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        
        if(Hostiles.length != 0) {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            
            if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
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
};

module.exports = CreepSentry;