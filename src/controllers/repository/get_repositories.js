const makeGetRepositories =
    () => (req, res) => {
        console.log('request params', req.query);

        res.code(200).send('Hello!');
    };



module.exports = makeGetRepositories;
