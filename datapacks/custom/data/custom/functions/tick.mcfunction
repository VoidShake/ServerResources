function custom:snow

execute as @e[tag=incendium_portal] at @s run function custom:incendium/portal
execute as @a[tag=!incendium_portal] at @s run function custom:incendium/tick

execute as @e[tag=skylands_portal] at @s run function custom:skylands/portal
execute as @a[tag=!skylands_portal] at @s run function custom:skylands/tick
