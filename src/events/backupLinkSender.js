export async function backupLinkSender(message, spoiler, backupLink) {
  function spoilerCheck(backupLink) {
    if (spoiler) {
      return `||${backupLink}||`;
    }
    return backupLink;
  }

  try {
    await message.reply({ content: spoilerCheck(backupLink), allowedMentions: { repliedUser: false } });
  } catch {
    // console.log('backupLink send error');
  }
}
