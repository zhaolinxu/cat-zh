var $dd = {
    /**
     * Todo: use proper meta wrapper
     */
    get: function(meta, id){
        if (!meta.$metaCache){
            meta.$metaCache = {};
        }

        var val = meta.$metaCache[id];
        if (val){
            return val;
        }

        for (var i in meta){
            if (meta[i].id == id){
                meta.$metaCache[id] = meta[i];
                return meta[i];
            }
        }
    }
};
