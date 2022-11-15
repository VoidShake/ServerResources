playsound minecraft:block.portal.travel block @s ~ ~ ~ 0.5 0.1
effect give @s minecraft:resistance 20 100 true

tag @s add incendium_travel_target

schedule function custom:incendium/tp 1s
schedule function custom:incendium/post_travel 2s
