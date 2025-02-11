export const sha256 = (message: string): string => {
  const rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    message,
    Utilities.Charset.UTF_8
  );
  let textHash = '';

  for (let i = 0; i < rawHash.length; i++) {
    let hashVal = rawHash[i];
    if (hashVal < 0) {
      hashVal += 256;
    }
    if (hashVal.toString(16).length === 1) {
      textHash += '0';
    }
    textHash += hashVal.toString(16);
  }

  return textHash;
};
