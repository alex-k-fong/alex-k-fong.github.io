# Asteroids Game

For CSCI 200 we had to create a final project which incorporated several fundamentals of programming concepts. We were encouraged to use graphic libraries like SFML in order to create calculators, games, tools, or other applications. 

In order to challenge myself further, I decided to try to program the game Asteroids. Asteroids was a worthy challenge for several many different reasons.
- When programming, I quickly realized that if I didn't stay organized, it would become impossible to debug or troubleshoot code.
- It quickly allowed me to realize the importance of using concepts like SOLID, KISS, and more.
- Asteroids could've been considered overkill given the requirements for the final included objectives like 
  - Including a datastructure
  - Utilize Big-Three
  - Use one original class
  - functionality beyond getters and setters

When I started programming this project, it was a breeze at first until I ran into creating collisions between the player, the ship and the projectiles from the players ship. This in particular was difficult because I had to create an algorithm for the program to check every entity during each cycle that the program ran. After a long while of racking my brain, I eventually landed on a pretty solid algorithm incorporating the distance function in combination with several nested loops. 