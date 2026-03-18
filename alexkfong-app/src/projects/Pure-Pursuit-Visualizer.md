# Pure Pursuit Visualizer

In order to develop a better autonomous for our FTC competition robot, we used the Pure Pursuit Pathtracking Algorithm. Pure pursuit is a system to make robot movement more efficient, by letting the robot turn corners without having to stop. It saves valuable time during autonomous runs when a robot has to navigate across a field with several obstacles or checkpoints, and allows more complex paths traversed. 

The basic idea for Pure Pursuit is using the robot location typically tracked with odometry to keep track of robot pose in combination with a field-centric path planning system. While the programmer plans a path by placing waypoints that connect to make a jagged rectangular path for the robot to follow, the works by creating a radius around the robot to follow and has a robot go straight to the an intersection point that connected between the robot's radius, and the path that is created. The result with combination of PID control is a robot that can traverse a smooth path without having to stop and turn at corners. 

I was able to develop a better understanding of Pure pursuit through following a Pure Pursuit Simulation series by Peter from Gluten Free FTC 11115. This differs from many pure pursuits in that instead of creating pure pursuit with regards to Ackerman steering, the control was adapted to skidsteer.

<video autoplay loop muted playsinline controls width="50%" class="md-video">
  <source src="/PurePursuitSimulation.mp4" type="video/mp4" />
</video>