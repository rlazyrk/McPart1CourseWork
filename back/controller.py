from service import insert_data, read_last_10_records, read_mc_data_with_id, read_mc_data_with_id_more, \
    read_last_100_record


def insert(mcAddress, humidity, temperature, isFire):
    insert_data(mcAddress, humidity, temperature, isFire)


def get_last_10():
    return read_last_10_records()


def get_data_starting_from(minId):
    return read_mc_data_with_id(minId)


def get_data_bigger_than(maxId):
    return read_mc_data_with_id_more(maxId)


def get_last_100_records():
    return read_last_100_record()
