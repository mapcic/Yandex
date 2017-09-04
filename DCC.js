(function(window, undefined) {
    function DCC(selector) {
        if (!(this instanceof DCC)) {
            return new DCC(selector);
        }
    };

    DCC.fn = DCC.prototype;
    window.DCC = DCC;

})(window);