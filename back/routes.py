from flask import Blueprint, jsonify, request
from controller import get_last_10, get_data_starting_from, get_data_bigger_than, get_last_100_records

bp = Blueprint('routes', __name__)


@bp.route('/last_10', methods=['GET'])
def get_last_10_records():
    min_id = request.args.get('id', type=int)
    if min_id is not None:
        data = get_data_starting_from(min_id)
    else:
        data = get_last_10()
    return jsonify(data)


@bp.route('/last_10Up', methods=['GET'])
def get_last_10_up():
    max_id = request.args.get('id', type=int)
    return jsonify(get_data_bigger_than(max_id))


@bp.route('/last_100', methods=['GET'])
def get_last_100():
    return get_last_100_records()
