// =====================================================================
//  Web resource for the "Add products to a bundle" sample.
//
//  Registered on the OnSelection event of the bundle products subgrid, so
//  that the selected product rows can be passed to the bundle association
//  logic shown in SampleMethod.cs.
// =====================================================================

var Sample = Sample || {};

Sample.BundleGrid = (function () {
    "use strict";

    /**
     * Returns the ids of the products currently selected in the subgrid.
     *
     * @param {object} gridContext the grid control the event was raised on
     * @returns {Array} the selected product ids
     */
    function getSelectedProductIds(gridContext) {
        var ids = [];
        var rows = gridContext.getGrid().getSelectedRows();

        rows.forEach(function (gridRow) {
            var data = gridRow.getData();
            ids.push(data.getEntity().getId());
        });

        return ids;
    }

    return {
        getSelectedProductIds: getSelectedProductIds
    };
})();
