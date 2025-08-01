class ISystem {
    update(world, deltaTime) {
        throw new Error("Method 'update' must be implemented");
    }
}

export default ISystem;