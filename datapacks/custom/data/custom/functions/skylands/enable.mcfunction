tag @e[tag=skylands_portal] remove disabled

execute if entity @e[tag=skylands_portal,tag=!disabled] run tellraw @s {"text":"Skylands Portal has been enabled","color":"blue"}
execute unless entity @e[tag=skylands_portal,tag=!disabled] run tellraw @s {"text":"No Skylands Portal found","color": "red"}
