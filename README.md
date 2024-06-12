TODO
- Env vars to connect to db in lambda
- react builds in pipeline with new env flags to point at backend
- deploy frontend and backend, test in aws wuwuwuwuwu
- DELETE INFRA IN AZURE LOL
- Vector db prototype??? RAG etc
- Data dog???
- Mobile friendly??


Tutorial
https://github.com/dair-ai/Prompt-Engineering-Guide
https://github.com/f/awesome-chatgpt-prompts



npm run build --mode prod


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
