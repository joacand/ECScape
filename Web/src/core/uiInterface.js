const UiInterface = {
    InterfaceHeight: 3,
    Width: 0,
    Height: 0,

    setBounds: function (width, height) {
        this.Width = width;
        this.Height = height;
    },

    get InterfaceStart() { return 0; },
    get InterfaceEnd() { return this.InterfaceHeight; },
    get TotalWidth() { return Math.floor(window.innerWidth / 10); }, // Adjust based on cell size
    get TotalHeight() { return Math.floor(window.innerHeight / 10); }, // Adjust based on cell size
    get WorldWidth() { return this.TotalWidth; },
    get WorldHeight() { return this.TotalHeight - 3; },
    get WorldTop() { return this.InterfaceHeight; },
    get WorldBottom() { return this.Height - 1; }
};

export default UiInterface;