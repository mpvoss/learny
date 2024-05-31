import json
import logging
import os
import sys
from datetime import datetime
from json import JSONDecodeError

import markdown
import pdfkit
from langchain.chains.summarize import load_summarize_chain
from langchain.output_parsers import ResponseSchema, StructuredOutputParser
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter

output_body = ""
MAX_DOCS = 9999999

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%dT%H:%M:%S',  # ISO 8601 format for the timestamp
    handlers=[logging.StreamHandler(sys.stdout)]  # Output to stdout
)

# response_schemas = [
#     ResponseSchema(name="emotional_state", description="adjectives that describe emotional state of user's docs"),
#     # ResponseSchema(name="priorities", description="priorities mentioned by the user's docs"),
#     ResponseSchema(name="struggles", description="struggles currently faced by the user"),
#     ResponseSchema(name="memorable_event", description="choose the most memorable event from user's docs"),
#     ResponseSchema(name="limiting_belief", description="limiting belief evident in user's docs"),
#     ResponseSchema(
#         name="mentor_advice",
#         description="give advice from a wise mentor based on user's docs",
#     ),
# ]
#
# output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
# format_instructions = output_parser.get_format_instructions()


def markdown_to_pdf(markdown_text, output_file):
    # Convert Markdown to HTML
    html_text = markdown.markdown(markdown_text, extensions=['tables'])
    print(html_text)
    html_text = html_text.replace("<table>","<table border=\"1\">")
    # Convert HTML to PDF
    pdfkit.from_string(html_text, output_file)


def read_pdfs_from_directory(directory):
    pdf_texts = []  # List to store all pdf contents
    for root, dirs, files in os.walk(directory):
        dirs.sort()
        files.sort()
        for filename in files:
            if filename.endswith('.pdf'):# and len(pdf_texts) < MAX_DOCS and ('2022' in filename and any(month in filename for month in ['May','Ju'])):
                pdf_path = os.path.join(root, filename)
                names.append(filename)
                try:
                    loader = PyPDFLoader(pdf_path)
                    pages = loader.load()

                    pdf_texts.append(pages)
                    logging.debug(f"Read {filename}")
                except Exception as e:
                    logging.error(f"Failed to read {filename}: {e}")
    return pdf_texts


names = []
# Specify the directory to search for PDFs
directory_path = '//home//mpvoss//Downloads//trash//journals//all//'
docs = read_pdfs_from_directory(directory_path)
logging.debug(f"Number of PDFs read: {len(docs)}")

llm = Ollama(model="eas/nous-hermes-2-solar-10.7b")
total_steps = len(docs)
curr_step = 0

for idx, docsubset in enumerate(docs):
    logging.debug(f"Progress: {idx + 1}/{total_steps}...")
    times_tried = 0
    is_done = False
    while times_tried < 3 and not is_done:
        try:
            collapse_prompt_template = PromptTemplate(
                template="Summarize the following analysis of a user's journals.\n{text}",
                input_variables=["text"],
                # partial_variables={"format_instructions": format_instructions},
            )

            # reduce_prompt = """Identify the struggles and insights described in this journal:\n{text}"""
            reduce_prompt = """What conclusions would a psychologist draw from this journal:\n{text}"""
            reduce_prompt_template = PromptTemplate(template=reduce_prompt, input_variables=["text"])

            summary_chain = load_summarize_chain(llm=llm,
                                                 chain_type='map_reduce',
                                                 map_prompt=reduce_prompt_template,
                                                 combine_prompt=collapse_prompt_template,
                                                 #                                      verbose=True
                                                 )

            text_splitter = RecursiveCharacterTextSplitter(separators=["\n\n"], chunk_size=10000, chunk_overlap=500)
            split_docs = text_splitter.split_documents(docsubset)

            for docidx, s in enumerate(split_docs):
                num_tokens_first_doc = llm.get_num_tokens(s.page_content)
                print(f"{docidx} has this many tokens: {num_tokens_first_doc}")

            summary = summary_chain.run(split_docs)
            # if "```json" in summary:
            #     json_string = summary.split("```json")[1].strip()[:-3]
            # else:
            #     json_string = summary
            #
            # print(json_string)
            # structured_data = json.loads(json_string)
            #
            # emotional_state = structured_data['emotional_state']
            # memorable_event = structured_data['memorable_event']
            # mentor_advice = structured_data['mentor_advice']
            # # priorities = structured_data['priorities']
            # struggles = structured_data['struggles']
            # limiting_belief = structured_data['limiting_belief']

            # md_content = f"""
            # #{names[idx]}  \n\n
            # Category        | Analysis
            # --------------- | ---
            # Emotional State | {emotional_state}
            # Memorable Event | {memorable_event}
            # Struggles       | {struggles}
            # Limiting belief | {limiting_belief}
            # Mentor Advice   | {mentor_advice}
            # """

            md_content = f"""
#{names[idx]}  \n
{summary}\n\n
"""
            output_body = output_body + md_content
            is_done = True
        except JSONDecodeError as e:
            logging.error("JSON ERROR SUCKS....retrying")
            times_tried = times_tried + 1

# Convert and save to PDF
now = datetime.now().isoformat()
safe_timestamp = now.replace(':', '_').replace('-', '_').split('.')[0]  # Removing milliseconds and replacing colons
# Define the filename with the ISO timestamp
pdf_output = f"out//{safe_timestamp}_output_maxdocs-{MAX_DOCS}.pdf"
markdown_to_pdf(output_body, pdf_output)
print("PDF created at:", pdf_output)