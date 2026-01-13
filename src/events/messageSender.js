export async function messageSender(message, spoiler, embed) {
  try {
    await message.reply({ content: spoiler, embeds: [embed], allowedMentions: { repliedUser: false } });
  } catch {
    // console.log('message send error');
  }
}
