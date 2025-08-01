import EntityFactory from '../entities/EntityFactory.js';
import UiInterface from '../core/uiInterface.js';

class Seeder {
    static seed(world) {
        EntityFactory.createPlayer(world, 0, 0);

        EntityFactory.createEnemy(world, 30, 0, 'X', 3, 2);
        EntityFactory.createEnemy(world, 30, 0, '%', 3, 1);
        EntityFactory.createEnemy(world, 10, 0, '#', 2, 1);

        EntityFactory.createGroundBlock(world, 0, UiInterface.WorldBottom - 2, UiInterface.WorldWidth, 3);
        EntityFactory.createCloudBlock(world, 20, 20, 3, 3);
    }
}

export default Seeder;