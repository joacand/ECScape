const UiInterface = {
    InterfaceHeight: 30,
    Width: 0,
    Height: 0,

    setBounds: function (width, height) {
        this.Width = width;
        this.Height = height;
    },

    get InterfaceStart() { return 0; },
    get InterfaceEnd() { return this.InterfaceHeight; },

    get TotalWidth() { return this.Width; },
    get TotalHeight() { return this.Height; },

    get WorldWidth() { return this.TotalWidth; },
    get WorldHeight() { return this.TotalHeight - 30; },
    get WorldTop() { return this.InterfaceHeight; },
    get WorldBottom() { return this.Height - 1; }
};

export default UiInterface;