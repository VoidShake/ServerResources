scoreboard players add @s[scores={incendium_portal_charge=..59}] incendium_portal_charge 1

effect give @s[scores={incendium_portal_charge=1..20}] minecraft:nausea 8 0 true
playsound minecraft:block.portal.ambient block @s[scores={incendium_portal_charge=1}] ~ ~ ~ 1.0 1.2
playsound minecraft:block.portal.ambient block @s[scores={incendium_portal_charge=1}] ~ ~ ~ 1.0 0.7

execute if entity @s[scores={incendium_portal_charge=55}] run function custom:incendium/travel
