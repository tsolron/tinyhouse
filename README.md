# Readme

Note that I am using Kittens Game as a reference for now - I like its complexity and want the capability to have a similar level of complexity in this engine. I 100% recommend trying Kittens Game if you like the Idle / Incremental genre! http://bloodrizer.ru/games/kittens/

# Task List
 * unit testing
 * json definition of game feature tree
 * saving/loading
 * Upgrades
   * once, repeating, infinite
 * make "game" public / eliminate need to pass it as parameter
   * Maybe JS equivalent of a Singleton?
 * identify location for multipliers
   * Common
   * buff/nerf
   * others?
 * Code / API documentation
 * Review naming conventions used
 * Review use of eval()
 * Resource Matrix
   * More efficient? Memory? CPU? GPU?
   * Libraries?
 * Offline progression
   * prerequisite: saving/loading, possibly resource Matrix
 * Review timing of recalculate()
 * Greater use of data type enforcement, ex. Number()
   * Is this needed in js?
 * Min/Max
   * Ensure they function as desired
     * Can't Exchange below min, but can above max
   * Is checked upon modification operations4
 * Review ways to increase capacity upon structure built
 * Vue Components to display a single Feature (& its resources/upgrades)
 * Identify a means of updating game without ruining saves

# Documentation
