using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

public class CPHInline
{
	public bool Execute()
	{
		string input = args.ContainsKey("rawInput") ? args["rawInput"].ToString() : "";
		string command = input.ToLower().Trim();

		// Add command to queue
		EnqueueGifCommand(command);

		// Start processing if not already running
		if (!CPH.GetGlobalVar<bool>("chatGifPlaying", true))
		{
			CPH.SetGlobalVar("chatGifPlaying", true, true);
			ProcessGifQueue();
		}

		return true;
	}

	private void EnqueueGifCommand(string command)
	{
		// Get current queue
		List<string> queue = CPH.GetGlobalVar<List<string>>("chatGifQueue", true) ?? new List<string>();

		// Add to queue
		queue.Add(command);

		// Save queue back
		CPH.SetGlobalVar("chatGifQueue", queue, true);
	}

	private void ProcessGifQueue()
	{
		SetChatGifVisibility(true);

		while (true)
		{
			// Get updated queue
			List<string> queue = CPH.GetGlobalVar<List<string>>("chatGifQueue", true) ?? new List<string>();

			if (queue.Count == 0)
				break;

			// Get and remove first command
			string command = queue[0];
			queue.RemoveAt(0);
			CPH.SetGlobalVar("chatGifQueue", queue, true);

			string filePath = GetGifPathFromJson(command);

			if (string.IsNullOrEmpty(filePath))
			{
				CPH.SendMessage("❌ No GIF found for: " + command);
				continue;
			}

			PlayGif(filePath);
		}

		// Only hide source if queue is empty
		SetChatGifVisibility(false);
		CPH.SetGlobalVar("chatGifPlaying", false, true);
	}

	private void PlayGif(string filePath)
	{
		// Update the media source file path
		string currentScene = CPH.ObsGetCurrentScene();
		CPH.ObsSetMediaSourceFile(currentScene, "chat-gifs", filePath);

		// Wait for the gif duration (adjustable)
		CPH.Wait(5000);
	}


	private string GetGifPathFromJson(string command)
	{
		string jsonPath = "E:\\TGF\\Assets\\TGFChatPage\\gifs.json";

		if (!File.Exists(jsonPath))
		{
			CPH.SendMessage("❌ GIF JSON file not found!");
			return null;
		}

		try
		{
			string jsonContent = File.ReadAllText(jsonPath);
			List<GifItem> gifs = JsonConvert.DeserializeObject<List<GifItem>>(jsonContent);

			foreach (var gif in gifs)
			{
				if (gif.command.ToLower() == command.ToLower())
					return gif.path;
			}
		}
		catch (Exception ex)
		{
			CPH.SendMessage("❌ Error parsing JSON: " + ex.Message);
		}

		return null;
	}

	private void SetChatGifVisibility(bool visible)
	{
		string currentScene = CPH.ObsGetCurrentScene();
		CPH.ObsSetSourceVisibility(currentScene, "chat-gifs", visible);
	}

	private class GifItem
	{
		public string command { get; set; }
		public string path { get; set; }
	}
}
