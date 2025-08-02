import EntityFactory from '../entities/EntityFactory.js';

class Seeder {
    static seed(world) {
        EntityFactory.createPlayer(world, 0, 0);

        EntityFactory.createEnemy(world, 230, 0, 'X', 30, 30);
        EntityFactory.createEnemy(world, 340, 0, '%', 30, 30);
        EntityFactory.createEnemy(world, 450, 0, '#', 30, 30);

        EntityFactory.createCloudBlock(world, 200, 200, 32, 32);
    }
}

export default Seeder;