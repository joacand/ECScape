import EntityFactory from '../entities/EntityFactory.js';
import UiInterface from '../core/uiInterface.js';

class Seeder {
    static seed(world) {
        EntityFactory.createPlayer(world, 0, 0);

        EntityFactory.createEnemy(world, 30, 0, 'X', 3, 2);
        EntityFactory.createEnemy(world, 30, 0, '%', 3, 1);
        EntityFactory.createEnemy(world, 10, 0, '#', 2, 1);

        // Ground blocks
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < UiInterface.WorldWidth; j++) {
                EntityFactory.createGroundBlock(world, j, UiInterface.WorldBottom - i);
            }
        }

        // Cloud blocks
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                EntityFactory.createCloudBlock(world, 20 - j, 20 - i);
            }
        }
    }
}

export default Seeder;