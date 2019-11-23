const Request = {
    objectToPOST(object) {
        const anURLSearchParams = new URLSearchParams();

        function build(obj, prefixArr) {
            if (Array.isArray(obj)) {
                obj.forEach((elem, i) => {
                    build(elem, prefixArr.concat(i));
                });
            } else if (obj instanceof Object) {
                Object.keys(obj).forEach((key) => {
                    build(obj[key], prefixArr.concat(key));
                });
            } else {
                const key = prefixArr[0] + (prefixArr.length <= 1 ? '' : `[${ prefixArr.slice(1).join('][') }]`);
                anURLSearchParams.set(key, String(obj));
            }
        }
        build(object, []);

        return anURLSearchParams;
    },
    get(url) {
        return fetch(url, {
            "method": 'GET',
            "credentials": "include",
            "headers": {},
            "mode": "cors",
        })
        .then((response) => {
            if (response.status !== 200) {
                throw response.json();
            }
            return response.json();
        });
    },
    post(url, object = {}) {
        return fetch(url, {
            "method": 'POST',
            "credentials": "include",
            "headers": {
                'Content-Type': 'application/json',
            },
            "mode": "cors",
            "body": JSON.stringify(object), // this.objectToPOST(object),
        })
        .then((response) => {
            if (response.status !== 200) {
                throw response.json();
            }
            return response.json();
        });
    }
};

export default Request;