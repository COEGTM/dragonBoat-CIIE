const ajaxPromise = param => {
    return new Promise((resolve, reject) => {
        $.ajax({
            "type": param.type || "get",
            "async": param.async || true,
            "url": param.url,
            "data": param.data || "",
            "success": res => {
                resolve(res);
            },
            "error": err => {
                reject(err);
            }
        })
    })
}