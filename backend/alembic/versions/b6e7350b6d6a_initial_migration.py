"""Initial migration

Revision ID: b6e7350b6d6a
Revises: 
Create Date: 2024-06-11 06:26:02.767313

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b6e7350b6d6a'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('discussions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('topic', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_discussions_id'), 'discussions', ['id'], unique=False)
    op.create_index(op.f('ix_discussions_topic'), 'discussions', ['topic'], unique=False)
    op.create_table('flashcards',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('term', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('repetition', sa.Integer(), nullable=True),
    sa.Column('easiness_factor', sa.Float(), nullable=True),
    sa.Column('interval', sa.Integer(), nullable=True),
    sa.Column('last_reviewed_date', sa.Date(), nullable=True),
    sa.Column('quality_of_last_review', sa.Integer(), nullable=True),
    sa.Column('created_date', sa.Date(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('notes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('content', sa.String(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('created_date', sa.Date(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tags',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('users',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('role', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=False),
    sa.Column('last_name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('id')
    )
    op.create_table('flashcard_tag_association',
    sa.Column('flashcard_id', sa.Integer(), nullable=True),
    sa.Column('tag_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['flashcard_id'], ['flashcards.id'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], )
    )
    op.create_table('messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('discussion_id', sa.Integer(), nullable=True),
    sa.Column('sender', sa.String(), nullable=True),
    sa.Column('content', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['discussion_id'], ['discussions.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_messages_id'), 'messages', ['id'], unique=False)
    op.create_table('note_tag_association',
    sa.Column('note_id', sa.Integer(), nullable=True),
    sa.Column('tag_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['note_id'], ['notes.id'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], )
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('note_tag_association')
    op.drop_index(op.f('ix_messages_id'), table_name='messages')
    op.drop_table('messages')
    op.drop_table('flashcard_tag_association')
    op.drop_table('users')
    op.drop_table('tags')
    op.drop_table('notes')
    op.drop_table('flashcards')
    op.drop_index(op.f('ix_discussions_topic'), table_name='discussions')
    op.drop_index(op.f('ix_discussions_id'), table_name='discussions')
    op.drop_table('discussions')
    # ### end Alembic commands ###