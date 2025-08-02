import EntityFactory from '../entities/EntityFactory.js';
import UiInterface from '../core/uiInterface.js';

class Seeder {
    static seed(world) {
        EntityFactory.createPlayer(world, 0, 0);

        EntityFactory.createEnemy(world, 30, 0, 'X', 30, 20);
        EntityFactory.createEnemy(world, 30, 0, '%', 30, 30);
        EntityFactory.createEnemy(world, 10, 0, '#', 30, 30);

        EntityFactory.createCloudBlock(world, 200, 200, 32, 32);
    }
}

export default Seeder;