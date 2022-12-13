require("dotenv").config();
const fs = require("fs");
const { Web3Storage, getFilesFromPath } = require("web3.storage");
const { createClient } = require("@supabase/supabase-js");

const token = process.env.WEB3_TOKEN;
const storage = new Web3Storage({ token });

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY
);

const fileUpload = async (name) => {
	try {
		const files = await getFilesFromPath("./file.json");
		const cid = await storage.put(files, {
			name: `${name}.json`,
			wrapWithDirectory: false,
		});
		console.log(cid);
		return cid;
	} catch (error) {
		console.log(error);
		return;
	}
};

const saveCID = async (cid, tags) => {
    try {
        const { data, error, status } = await supabase
            .from("ipfscid")
            .insert({ type: "question", cid: cid, tags: tags });

        console.log("Data ", data);
        console.log("ERROR ", error);
        console.log("Status ", status);
        return status
    } catch (error) {
        console.log(error);
        return;
    }
}

const createFileAndUpload = async (data, name) => {
	try {
		fs.writeFileSync("file.json", JSON.stringify(data));
		const cid = await fileUpload(name);
        await saveCID(cid, data.tags)
		return cid;
	} catch (error) {
		console.log(error);
		return;
	}
};

const getTags = (message) => {
	let tags = [];
	message.split(" ").forEach((word) => {
		if (word.includes("#")) {
			tags.push(word);
		}
	});

	return tags.join(" ");
};

module.exports = { createFileAndUpload, getTags };
