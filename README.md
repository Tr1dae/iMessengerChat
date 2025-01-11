Simple HTML page I created to mimic iMessage chats. This is intended for creative writing. There are many of these setup out there but this one is mine.

I got carried away and implemented a link to LM Studio API endpoint, simply launch the LM Studio server and connect. You can now chat to your LLM of choice via this interface. 

- The Store button or "enter" sends a message to the chat as yourself
- The Camera button or "ctrl+enter" sends a message to the chat as your contact.
- Right click a message to show the context-menu.
        Here you can edit the message (also available via double click)
        Swap the message sender
        Insert a message after
        Insert an image after
- Drag messages to re-arrange the order in the chat.
- Click the contact profile image to import a custom image.  

Click the top left "Back" button to access *Settings* - - 
  Here you can create a NewChat, ClearChat, DeleteChat, SaveChat, Import conversation txt and enable the LiveChat to LLM

      
NewChat: 
    Creates a new chat accesssable through the dropdown. Useful for managing multiple characters and stories. 

Import Conversation txt:
    I added this to auto populate the chat layout from txt chat transcripts. 
    It's able to do some cleanup and parsing so the format doesnt need to be absolutely perfect but it helps to follow the basic formula of
        
  Name: content
            eg-
  Dave: Hello there!
  Emily: Hi! How are you?

  The importer will set messages based on the title of the chat. So if your chat title is "Dave" then all messages labelled as such will come from the contact. 

  To speed up the process of import there's also a "Paste from Clipboard" button that does the same as the txt importer. 
  Useful if you're copying from a different place in bulk.
  It will properly parse outputs from chatGPT and the like. 

LiveChat Settings:
  LM studio server is simple to setup. Once you have that running you can imput your server URL into the field and configure your System prompt. 
  Press connect - the ConnectionStatus should update
    Now you're able to chat to the LLM via the interface. 
    It will take your previous conversation hostory into account when generating new replies. I currently have it hardcoded to 150 previous resplies kept in memory, TO-DO - expose this parameter as a setting. 
    Sending a message as yourself will prompt the LLM to respond. 

If you edit any message from yourself or the contact the LLM will accept this new path and continue. Useful for correcting direction. 

Happy Chatting!

    
