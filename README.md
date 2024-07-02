MVP
- Vector DB minimal RAG (can load document, talk to document)
- App should be user-sensitive (different data for different users)
- Mobile friendly??
- Prototype new timeline library
- Diagrams screen? Able to save from chat
- initial page load bug
- Code Cleanup
- Readme with diagrams
- Video demo
- AI messages should know if they render the "flashcard wizard or save note" btns", looks dumb in some situations


Demo Wish list
- Quiz generation...
- ELI5 mode
- Socratic mode... Questions generated after each response? 
- Want to show rag
- Want to show timeline, ability to save and review later
- Question suggester, concept map, timeline, make flash cards, use them
- Save notes, edit
- Tagging 
- Perspective enhancer question maker 
- Perspective enhancer - user gives their understanding and AI can give feedback


CRUD screens for Notes, Flashcards...
- Edit button, delete button, ADD workflow
- Fix the prompts for flash card generation. Question, topic if possible, short answers, many questions over single large answers
- Help pop up for Study screen, explain ANKII spaced repitition
- what are we doing with settings btn when on non chat screens? Seems like that would be needed always
- formatting for Notes list? 


RAG design
- Brainstorm
  - Is this a special interface? 
  - I mean we really just want to talk to our own docs
  - Maybe it's a flag in the regualr chat ui
- Spec
  - NEW SCREEN: DOCS
  - Chat can now leverage docs...maybe it's a toggle?
  - All regular features still work, notes, flash cards etc
  - User actions: Upload doc, talk to it, etc
- Steps to prototype
  - Ability to upload file, send through idx
  - API endpoint which uses doc as ctx



Lacedb vs pgvector
I don't want to introduce a new vector db
So the next step would be
- Llama Index
- PG Vector
- Rerank model
- Embeddings model






TODO
- legit 404 page
- Stand up test env
- Force diagram with concepts - let it imagine the names of lines, then draw them for arbitraty concept maps
- clean way to show toast for errors
- AUDIT ALL ENDPOITNS FOR AUTH DEPENDENCY PROGRAMMATICALLY
- Vector db prototype??? RAG etc
- Data dog???

iterative timeline builder needed. Probably iterative everything diagram builder.
-Add this empire, add other etc. Maybe option to remove also?

image support for ankii cards
https://github.com/kerrickstaley/genanki?tab=readme-ov-file#media-files

Visuals
- Concept map
- Period analysis (gantt)
- Timeline with dots
- Explore with react elements sequentially
VECTOR STOREEEEEE


Tutorial
https://github.com/dair-ai/Prompt-Engineering-Guide
https://github.com/f/awesome-chatgpt-prompts




React Flow concept maps!!!!
- Tell me more button
- to flash card button
- Chat screen to concept map link?
-- come up with multiple perspectives, draft questions based on those personas
  


# TODO   
3. Flashcards
  1. Flashcard screen has search view based on tags
  1. Endpoint to count what cards are ready for study
  1. Ability to enter study screen with a tag
  1. Study screen can POST to /flashcards/review, update db
  1. Clean up aesthetics of flashcard screen
Polish
- Notes need CRUD on notes screen
- Flash cards need CRUD on FC screen (import/export)?
- Notes/flashcards proper search?
- Mobile friendly...




Nice to have
1. Strong need to capture "THEME" or subject of each card. The cards themselves don't have a lot of context in definition alone
1. Vector db design?
1. Message pagination
1. Ability to generate flashcards from arbitrary topic would be sweet
  1. Magic buttons? The qhelper could go there too
1. Would be super cool to generate diagrams of like civilizations and their interactions...
  1. Probably multi step 
    1. Ask for one entity, suggest a group of peers
    1. User approves peers or asks for more
    1. AI suggests a handful of types of relationships they might be interested in (comquered, traded with, etc)
    1. AI generates diagram
    1. Expecting to return to force diagram from that one library...





# Cloud architecture
Need to evaluate a few different models and compare performance vs cost
5. https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard
6. Maybe track the tokens used by each user, model, cost per etc. DIY
7. Steal features from : https://portkey.ai/features/observability
8. gpt 3.5 turbo, 4 omni price compare and feature compare
https://learn.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-static-website-terraform?tabs=azure-cli
9. https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_function_app


## DB commands
Create migration 

`alembic revision --autogenerate -m "Initial migration"`  

Run it

`alembic upgrade head`


# Check size of deps
du -sh * | sort -h


https://pashpashpash.substack.com/p/tackling-the-challenge-of-document
https://pashpashpash.substack.com/p/understanding-long-documents-with

| --- | --- | --- |
| --- | --- | --- |
| Cell 1 | Cell 2 | Cell 3 |  
| Cell 4 | Cell 5 | Cell 6 |

providing context based on the drill down seems important

could do that via a cache...but langchain probably has a better way
