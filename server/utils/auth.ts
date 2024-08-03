import { hash, compare } from "bcryptjs";

const encrypt = async (pass: string) => {
	return await hash(pass, 10);
};

const verify = async (pass: string, passHash: string) => {
	return await compare(pass, passHash);
};

export { encrypt, verify };
