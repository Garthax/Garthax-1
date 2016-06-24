var CreepTruck = {
    run: function(creep) {
        var Hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        
        if(Hostiles.length != 0) {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            
            if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else {
            var FlagPosition = creep.room.find(FIND_FLAGS);
            var Index = creep.memory.Index
            
            while (creep.pos != FlagPosition[Index].pos) {
                creep.say("Patrol" + (Index + 1))
                creep.moveTo(FlagPosition[Index])
            }
            
            if (creep.memory.Index != 3) {
                creep.memory.Index = (Index + 1)
            }
            else {
                creep.memory.Index = 0
            }
        }
    }
};

module.exports = CreepTruck;