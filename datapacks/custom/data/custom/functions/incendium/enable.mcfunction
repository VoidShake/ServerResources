tag @e[tag=incendium_portal_disabled] add incendium_portal
tag @e[tag=incendium_portal] remove incendium_portal_disabled

execute if entity @e[tag=incendium_portal] run tellraw @s {"text":"Incendium Portal has been enabled","color":"blue"}
execute unless entity @e[tag=incendium_portal] run tellraw @s {"text":"No incendium portal found","color": "red"}
