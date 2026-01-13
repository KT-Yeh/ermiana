export async function messageSubSender(message, spoiler, embed) {
  try {
    await message.channel.send({ content: spoiler, embeds: [embed] });
  } catch {
    // console.log('message send error');
  }
}
