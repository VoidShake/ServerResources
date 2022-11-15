playsound minecraft:block.portal.travel block @s ~ ~ ~ 0.5 0.1
effect give @s minecraft:resistance 20 100 true

execute as @e[tag=skylands_portal,sort=nearest,limit=1] at @s run particle flash ~ ~ ~

tag @s add skylands_travel_target

schedule function custom:skylands/tp 1t
schedule function custom:skylands/post_travel 2t
