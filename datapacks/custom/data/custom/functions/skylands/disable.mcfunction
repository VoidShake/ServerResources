tag @e[tag=skylands_portal] add disabled

execute if entity @e[tag=skylands_portal,tag=disabled] run tellraw @s {"text":"Skylands Portal has been disabled","color":"blue"}
execute unless entity @e[tag=skylands_portal,tag=disabled] run tellraw @s {"text":"No Skylands Portal found","color": "red"}
