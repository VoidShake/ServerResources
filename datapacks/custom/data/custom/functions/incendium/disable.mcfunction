tag @e[tag=incendium_portal] add incendium_portal_disabled
tag @e[tag=incendium_portal_disabled] remove incendium_portal

execute if entity @e[tag=incendium_portal_disabled] run tellraw @s {"text":"Incendium Portal has been disabled","color":"blue"}
execute unless entity @e[tag=incendium_portal_disabled] run tellraw @s {"text":"No Incendium Portal found","color": "red"}
