const toArray = async (cursor) => {
    var arr = [];
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        arr.push(doc);
    }
    return arr;
};

module.exports = { toArray };